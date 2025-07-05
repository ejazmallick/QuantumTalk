// import fs from 'fs';
// import path from 'path';

// export const getUploadedFiles = (req, res) => {
//     const directoryPath = path.join(__dirname, '../uploads/files');

//     fs.readdir(directoryPath, (err, files) => {
//         if (err) {
//             console.error("❌ Error reading directory:", err);
//             return res.status(500).json({ error: "Error reading directory", details: err.message });
//         }

//         // Send the list of files as a response
//         return res.status(200).json({ files });
//     });
// };
