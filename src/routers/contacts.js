import { Router } from 'express';
import {
  createContactsController,
  deleteContactsController,
  getAllContactsByIdController,
  getAllContactsController,
  updateContactsController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactsSchema,
  updateContactsSchema,
} from '../validation/contact.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/', getAllContactsController);

router.get('/:contactId', isValidId, getAllContactsByIdController);

router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactsSchema),

  createContactsController,
);

router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactsSchema),

  updateContactsController,
);

router.delete('/:contactId', isValidId, deleteContactsController);

export const contactsRouter = router;
