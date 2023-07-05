// import axios from "axios";

// const generateImageURL = async (image) => {
//   const file = new FormData();
//   file.append("file", image);
//   file.append("upload_preset", "eCommerce");

//   const { data } = await axios.post(
//     "https://api.cloudinary.com/v1_1/meshkkr91/image/upload",
//     file
//   );
//   return data;
// };

// export default generateImageURL;

import { Cloudinary } from "@cloudinary/url-gen";
import axios from "axios";
import sharp from "sharp";

// Create and configure your Cloudinary instance.
const cld = new Cloudinary({
  cloud: {
    cloudName: "meshkkr91",
  },
});

const generateImageURL = async (image) => {
  const originalSize = image.size / 1024; // Convert to kilobytes
  console.log("Original image size:", originalSize.toFixed(2), "KB");

  const optimizedImage = await compressImage(image, 200); // Compress image to maximum 200kb

  const optimizedSize = optimizedImage.size / 1024; // Convert to kilobytes
  console.log("Optimized image size:", optimizedSize.toFixed(2), "KB");

  const file = new FormData();
  file.append("file", optimizedImage);
  file.append("upload_preset", "eCommerce");

  const { data } = await axios.post(
    "https://api.cloudinary.com/v1_1/meshkkr91/image/upload",
    file
  );
  return data;
};

const compressImage = async (image, maxSizeKB) => {
  const compressedImage = await sharp(image.path)
    .resize({ fit: "inside", withoutEnlargement: true, width: 800 }) // Resize the image if needed
    .jpeg({ quality: 80 }) // Set JPEG quality (adjust as needed)
    .toBuffer();

  if (compressedImage.length < maxSizeKB * 1024) {
    return compressedImage; // If the image is already smaller than the maximum size, return it as is
  }

  const iterations = Math.ceil(Math.log2(image.size / (maxSizeKB * 1024)));
  const compressionRatio = 1 - 1 / 2 ** iterations;

  const finalImage = await cld
    .image(compressedImage)
    .quality(compressionRatio * 100)
    .toBlob();

  return finalImage;
};

export default generateImageURL;
