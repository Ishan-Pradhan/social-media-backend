import Mailgen from "mailgen";
import { Product } from "../models/apps/ecommerce/product.models.js";
import logger from "../logger/winston.logger.js";
import axios from "axios";

/**
 * @param {{email: string; subject: string; mailgenContent: Mailgen.Content}} options
 */
const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "FreeAPI",
      link: "https://freeapi.app",
    },
  });

  const emailText = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const payload = {
    from: {
      email: process.env.MAILTRAP_FROM_EMAIL,
      name: "FreeAPI",
    },
    to: [
      {
        email: options.email,
      },
    ],
    subject: options.subject,
    text: emailText,
    html: emailHtml,
  };

  try {
    await axios.post(`${process.env.MAILTRAP_API_URL}/api/send`, payload, {
      headers: {
        Authorization: `Bearer ${process.env.MAILTRAP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Mail sent successfully via Mailtrap API");
  } catch (error) {
    logger.error("Mailtrap API email failed", {
      error: error?.response?.data || error.message,
    });
  }
};

/**
 *
 * @param {string} username
 * @param {string} verificationUrl
 * @returns {Mailgen.Content}
 * @description It designs the email verification mail
 */
const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app! We're very excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

/**
 *
 * @param {string} username
 * @param {string} verificationUrl
 * @returns {Mailgen.Content}
 * @description It designs the forgot password mail
 */
const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of our account",
      action: {
        instructions:
          "To reset your password click on the following button or link:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

/**
 *
 * @param {string} username
 * @param {{_id: string, product: Product, quantity: number}[]} items
 * @param {number} totalCost
 * @returns {Mailgen.Content}
 * @description It designs the order creation invoice mail
 */
const orderConfirmationMailgenContent = (username, items, totalCost) => {
  return {
    body: {
      name: username,
      intro: "Your order has been processed successfully.",
      table: {
        data: items?.map((item) => {
          return {
            item: item.product?.name,
            price: "INR " + item.product?.price + "/-",
            quantity: item.quantity,
          };
        }),
        columns: {
          // Optionally, customize the column widths
          customWidth: {
            item: "20%",
            price: "15%",
            quantity: "15%",
          },
          // Optionally, change column text alignment
          customAlignment: {
            price: "right",
            quantity: "right",
          },
        },
      },
      outro: [
        `Total order cost: INR ${totalCost}/-`,
        "You can check the status of your order and more in your order history",
      ],
    },
  };
};

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  orderConfirmationMailgenContent,
};
