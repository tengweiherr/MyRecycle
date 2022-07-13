import multer from 'multer';
import path from "path";

//upload excel

// const excelFilter = (req, file, cb) => {
//   if (
//     file.mimetype.includes("excel") ||
//     file.mimetype.includes("spreadsheetml")
//   ) {
//     cb(null, true);
//   } else {
//     cb("Please upload only excel file.", false);
//   }
// };
// const excelStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null,+ "./resources/static/assets/uploads/");
//   },
//   filename: (req, file, cb) => {
//     console.log(file.originalname);
//     cb(null, `${Date.now()}-myrecycle-${file.originalname}`);
//   },
// });
// const uploadFile = multer({ storage: excelStorage, fileFilter: excelFilter });

//upload pdf
const pdfFilter = (req, file, cb) => {
  if(file.mimetype.includes("pdf")){
    cb(null,true);
  }
  else cb("Please upload only pdf file.", false);
};
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/pdf/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadPdf = multer({ 
  storage: pdfStorage, 
  fileFilter: pdfFilter
 });

//upload report

const reportStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/reports/')
  },
  filename: function (req, file, cb) {
    cb(null, "myrecycle-report-" + Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

const uploadReport = multer({
  storage:reportStorage
});

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/')
  },
  filename: function (req, file, cb) {
    cb(null, "myrecycle-product-" + Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

const uploadProduct = multer({
  storage:productStorage
});

const materialStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/materials/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //Appending extension
  }
})

const uploadMaterial = multer({
  storage:materialStorage
});

const rewardStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/rewards/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //Appending extension
  }
})

const uploadReward = multer({
  storage:rewardStorage
});


// const fileFilter = (req, file, cb) => {
//     if (file.mimetype == 'text/plain') {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }




export {uploadPdf, uploadReport, uploadProduct, uploadMaterial, uploadReward};