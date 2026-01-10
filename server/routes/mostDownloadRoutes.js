import express from 'express';
import MostDownload from '../models/MostDownload.js';
import UploadApk from '../models/UploadApk.js'; // your APK model

const router = express.Router();

// CREATE / UPDATE (upsert - if exists update, else create)
router.post('/', async (req, res) => {
  try {
    const { app_id } = req.body;

    if (!app_id) {
      return res.status(400).json({ error: 'app_id is required' });
    }

    const promotion = await MostDownload.findOneAndUpdate(
      { app_id },
      { app_id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(promotion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all most download entries (with joined app data)
router.get('/', async (req, res) => {
  try {
    const promotions = await MostDownload.find()
      .sort({ createdAt: -1 })
      .lean();

    // Join with active apps
    const appIds = promotions.map(p => p.app_id);
    const apps = await UploadApk.find({
      apk_Id: { $in: appIds },
      status: 'active'
    })
      .select('apk_Id apkTitle apkLogo screenshots user')
      .populate('user', 'email name')
      .lean();

    const appMap = new Map(apps.map(app => [app.apk_Id, app]));

    const result = promotions
      .map(promo => {
        const app = appMap.get(promo.app_id);
        if (!app) return null;
        return {
          _id: promo._id,
          app_id: promo.app_id,
          apkTitle: app.apkTitle,
          apkLogo: app.apkLogo ? `${process.env.BASE_URL || 'http://localhost:5005'}${app.apkLogo}` : null,
          screenshots: app.screenshots || [],
          author: app.user?.email || app.user?.name || 'Unknown',
        };
      })
      .filter(Boolean);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await MostDownload.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ message: 'Removed from Most Download successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;