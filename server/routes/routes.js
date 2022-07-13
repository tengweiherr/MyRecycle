import express from 'express';
import { uploadPdf, uploadReport, uploadProduct, uploadMaterial, uploadReward } from "../middlewares/upload.js";

import { signup, login, isAuth, updateUserById } from '../controllers/authController.js';
import { createCollector, createBulkCollector, getCollector, getCollectorByStatus, getCollectorByStatusAndCategory, updateCollectorById, updateCollectorByStatus, collectorScrap, deleteCollectorById } from '../controllers/collectorController.js';
import { createProduct, createBulkProduct, getProduct, getProductByGTIN, getProductByStatus, updateProductByStatus, updateProductByGTIN, deleteProductByGTIN } from '../controllers/productController.js';
import { createReport, getReport, getReportById, getReportByStatus, getReportByIdStatus, updateReportByStatus, updateReportById, deleteReportById } from '../controllers/reportController.js';
import { getUser, getUserById, getUserByEmail, getUserByState, getUserByRole, updateUserByEmail, deleteUserById } from '../controllers/userController.js';
import { createMaterial, getMaterial, getMaterialByCategory, getOneMaterial, updateMaterialById, deleteMaterialById } from '../controllers/materialController.js'; 
import { createBatch, getBatch, getBatchByCategory, updateBatchById, deleteBatchById } from '../controllers/batchController.js'; 
import { createReward, getReward, getRewardByBatch, updateRewardById, deleteRewardById, redeemReward } from '../controllers/rewardController.js';
import { createMRPoint, getMRPoint, getMRPointByUserId, updateMRPointById, deleteMRPointById } from '../controllers/mrpointController.js';
import { createGuide, getGuide, updateGuideById, deleteGuideById } from '../controllers/guideController.js';
import { createGame, getGame, updateGameById, deleteGameById } from '../controllers/gameController.js';


const router = express.Router();

//authentication
router.post('/login', login);

router.post('/signup', signup);

router.get('/private', isAuth);

router.get('/public', (req, res, next) => {
    res.status(200).json({ message: "here is your public resource" });
});

//user
router.get('/user', getUser);

router.get('/user/email/:email', getUserByEmail);

router.get('/user/:id', getUserById);

router.get('/user/state/all', getUserByState);

router.get('/user/role/:role', getUserByRole);

router.post('/user/:id', updateUserById);

router.delete('/user/:id', deleteUserById);

//collector
router.post('/collector', createCollector);

router.post('/collectorbulk', createBulkCollector);

router.get('/collector', getCollector);

router.post('/collector/:id', updateCollectorById);

router.post('/collector/status/:id', updateCollectorByStatus);

router.get('/collector/:status', getCollectorByStatus);

router.get('/collector/:status/:category', getCollectorByStatusAndCategory);

router.post('/collectorscrap',uploadPdf.single('pdf'), collectorScrap);

router.delete('/collector/:id', deleteCollectorById);

//product
router.post('/product',uploadProduct.single('media'), createProduct);

router.post('/productbulk',createBulkProduct);

router.get('/product', getProduct);

router.get('/product/status/:status', getProductByStatus);

router.post('/product/status/:gtin', updateProductByStatus);

router.get('/product/:gtin', getProductByGTIN);

router.post('/product/:gtin', updateProductByGTIN);

router.delete('/product/:gtin', deleteProductByGTIN);

// router.post("/product/excel/upload", upload.single("file"), uploadProduct);

//material
router.post('/material', createMaterial);

router.get('/material', getMaterial);

router.get('/material/category/:category', getMaterialByCategory);

router.get('/material/:material', getOneMaterial);

router.post('/material/:id', uploadMaterial.array('media',6),updateMaterialById);

router.delete('/material/:id', deleteMaterialById);

//reward
router.post('/reward', createReward);

router.get('/reward', getReward);

router.get('/reward/:batch_id', getRewardByBatch);

router.post('/reward/:reward_id', updateRewardById);

router.delete('/reward/:reward_id', deleteRewardById);

router.post('/rewardredeem', redeemReward);

//batch
router.post('/batch',uploadReward.single('media'), createBatch);

router.get('/batch', getBatch);

router.get('/batch/:rewards_category', getBatchByCategory);

router.post('/batch/:batch_id', updateBatchById);

router.delete('/batch/:batch_id', deleteBatchById);

//MRPoint
router.post('/mrpoint', createMRPoint);

router.get('/mrpoint', getMRPoint);

router.get('/mrpoint/:user_id', getMRPointByUserId);

router.post('/mrpoint/:mrpoint_id', updateMRPointById);

router.delete('/mrpoint/:mrpoint_id', deleteMRPointById);

//report
router.post('/report', uploadReport.array('media', 4), createReport);

router.get('/report', getReport);

router.get('/report/status/:status', getReportByStatus);

router.get('/report/:id', getReportById);

router.get('/report/:id/:status', getReportByIdStatus);

router.post('/report/status/:id', updateReportByStatus);

router.post('/report/:id', updateReportById);

router.delete('/report/:id', deleteReportById);

//Recycle Guide
router.post('/guide', createGuide);

router.get('/guide', getGuide);

router.post('/guide/:id', updateGuideById);

router.delete('/guide/:id', deleteGuideById);

//Game
router.post('/game', createGame);

router.get('/game', getGame);

router.post('/game/:id', updateGameById);

router.delete('/game/:id', deleteGameById);

// will match any other path
router.use('/', (req, res, next) => {
    res.status(404).json({error : "page not found"});
});


export default router;