import express from 'express';
import SaveUserAction from './actions/settings/SaveUserAction';

const SettingsController = express.Router();
SettingsController.post('/saveUser', SaveUserAction);

export default SettingsController;