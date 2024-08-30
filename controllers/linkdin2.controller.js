const axios = require("axios");
const prisma = require("../db/prismaClient");

const baseUrl = "https://api.linkedin.com/v2";
const { encryptData } = require("../functions/encrypt");

function urnToId(urn) {
  return urn.split(":").pop();
}

function idToUrn(id, type = "person") {
  if (type === "person") {
    return `urn:li:person:${id}`;
  }

  if (type === "organization") {
    return `urn:li:organization:${id}`;
  }

  if (type === "share") {
    return `urn:li:share:${id}`;
  }

  if (type === "asset") {
    return `urn:li:digitalmediaAsset:${id}`;
  }

  if (type === "upload") {
    return `urn:li:digitalmediaUpload:${id}`;
  }
}

const scopes = [
  "r_1st_connections_size",
  "r_basicprofile",
  "rw_organization_admin",
  "w_member_social",
  "w_organization_social",
  "r_ads_reporting",
  "r_organization_admin",
  "r_organization_social",
  "r_ads",
  "rw_ads",
  "email",
  "openid",
  "profile",
];

const getAuthUrl = async (req, res, next) => {
  try {
    const encodedScopes = scopes
      .map((scope) => encodeURIComponent(scope))
      .join("%20");

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&scope=${encodedScopes}`;

    res.send({ authUrl });
  } catch (error) {
    console.log(error);
  }
};

const memberDetail = async (req, res, next) => {
  try {
    const userAccount = req.userAccount;

    const data = userAccount.data;

    const { tokenType, accessToken } = data;

    const response = await axios.get(`${baseUrl}/me`, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
    });

    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
};

const callback = async (req, res, next) => {
  try {
    const code = req.query.code;

    console.log(code);
    return res.send({ code });

    const response = await axios.post(
      `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&client_id=${process.env.LINKEDIN_CLIENT_ID}&client_secret=${process.env.LINKEDIN_CLIENT_SECRET}`
    );

    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
};

const connectAccount = async (req, res, next) => {
  try {
    const code = req.query.code;

    const userAccount = await prisma.connectAccounts.findFirst({
      where: {
        AND: [
          {
            userId: req.user.id,
          },
          {
            provider: "linkedin",
          },
        ],
      },
    });

    if (userAccount) {
      return res.status(400).send({ error: "Account already connected" });
    }

    const response = await axios.post(
      `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&client_id=${process.env.LINKEDIN_CLIENT_ID}&client_secret=${process.env.LINKEDIN_CLIENT_SECRET}`
    );

    const accessTokenExpiresAt = new Date(
      response.data.expires_in * 1000 + Date.now()
    );
    const refreshTokenExpiresAt = new Date(
      response.data.refresh_token_expires_in + Date.now()
    );

    const data = {
      tokenType: response.data.token_type,
      accessToken: response.data.access_token,
      accessTokenExpiresAt: accessTokenExpiresAt,
      refreshToken: response.data.refresh_token,
      refreshTokenExpiresAt: refreshTokenExpiresAt,
      idToken: response.data.id_token,
    };

    const encryptedData = await encryptData(data);

    const { data: userinfo } = await axios.get(`${baseUrl}/me`, {
      headers: {
        Authorization: `${data.tokenType} ${data.accessToken}`,
      },
    });

    console.log(userinfo);

    const connectAccount = await prisma.connectAccounts.create({
      data: {
        provider: "linkedin",
        userId: req.user.id,
        data: encryptedData,
        accessTokenExpiresAt: accessTokenExpiresAt,
        refershTokenExpiresAt: refreshTokenExpiresAt,
        providerId: userinfo.id,
      },
    });

    res.send({ message: "Account connected" });
  } catch (error) {
    console.log(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const { tokenType, accessToken } = req.userAccount.data;

    const response = await axios.get(`${baseUrl}/userinfo`, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
    });

    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
};

const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "No video provided" });
    }

    const { tokenType, accessToken } = req.userAccount.data;

    const response = await axios.post(
      `${baseUrl}/assets?action=registerUpload`,
      {
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-video"],
          owner: idToUrn(req.userAccount.providerId),
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `${tokenType} ${accessToken}`,
        },
      }
    );

    console.log(response.data);

    const uploadUrl =
      response.data.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;

    const asset = response.data.value.asset;

    const video = req.file;

    const uploadResponse = await axios.put(uploadUrl, video.buffer, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
        "Content-Type": "application/octet-stream",
      },
    });

    console.log(uploadResponse.data);

    res.send({ message: "Video uploaded", id: urnToId(asset) });
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      res.status(500).send(error.response.data);
    } else {
      console.log(error);
    }
  }
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "No image provided" });
    }

    const { tokenType, accessToken } = req.userAccount.data;

    const response = await axios.post(
      `${baseUrl}/assets?action=registerUpload`,
      {
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          owner: idToUrn(req.userAccount.providerId),
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `${tokenType} ${accessToken}`,
        },
      }
    );

    console.log(response.data);

    const uploadUrl =
      response.data.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;

    const asset = response.data.value.asset;

    const image = req.file;

    const uploadResponse = await axios.put(uploadUrl, image.buffer, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
        "Content-Type": "contentType",
      },
    });

    console.log(uploadResponse.data);

    res.send({ message: "Image uploaded", id: urnToId(asset) });
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      res.status(500).send(error.response.data);
    } else {
      console.log(error);
    }
  }
};

const post = async (req, res, next) => {
  try {
    // maximum 20 images and 1 video
    // visibility =CONNECTIONS,PUBLIC

    const { type, text, visibility, images, video, url } = req.body;

    if (type === "text") {
      const response = await axios.post(
        `${baseUrl}/ugcPosts`,
        {
          author: idToUrn(req.userAccount.providerId),
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: text,
              },
              shareMediaCategory: "NONE",
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": visibility,
          },
        },
        {
          headers: {
            Authorization: `${req.userAccount.data.tokenType} ${req.userAccount.data.accessToken}`,
          },
        }
      );
    }

    if (type === "image") {
      if (!images) {
        return res.status(400).send({ error: "No images provided" });
      }

      if (images.length > 20) {
        return res.status(400).send({ error: "Maximum 20 images allowed" });
      }

      const media = images.map((image) => {
        return {
          status: "READY",
          description: {
            text: image.description,
          },
          media: idToUrn(image.id, "asset"),
          title: {
            text: image.title,
          },
        };
      });

      const response = await axios.post(
        `${baseUrl}/ugcPosts`,
        {
          author: idToUrn(req.userAccount.providerId),
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: text,
              },
              shareMediaCategory: "IMAGE",
              media: media,
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        },
        {
          headers: {
            Authorization: `${req.userAccount.data.tokenType} ${req.userAccount.data.accessToken}`,
          },
        }
      );
    }

    if (type === "url") {
      const response = await axios.post(
        `${baseUrl}/ugcPosts`,
        {
          author: idToUrn(req.userAccount.providerId),
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: text,
              },
              shareMediaCategory: "ARTICLE",
              media: [
                {
                  status: "READY",
                  description: {
                    text: url.description,
                  },
                  originalUrl: url.url,
                  title: {
                    text: url.title,
                  },
                },
              ],
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": visibility,
          },
        },
        {
          headers: {
            Authorization: `${req.userAccount.data.tokenType} ${req.userAccount.data.accessToken}`,
          },
        }
      );
    }

    res.send({ message: "Post created" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAuthUrl,
  callback,
  connectAccount,
  getMe,
  memberDetail,
  post,
  uploadImage,
};
