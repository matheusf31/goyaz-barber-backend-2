import { container } from 'tsyringe';

import IStoragePrivider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

// import IMailProvider from './MailProvider/models/IMailProvider';

container.registerSingleton<IStoragePrivider>(
  'StorageProvider',
  DiskStorageProvider,
);
