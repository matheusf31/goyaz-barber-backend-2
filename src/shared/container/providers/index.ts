import { container } from 'tsyringe';

import IStoragePrivider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

container.registerSingleton<IStoragePrivider>(
  'StorageProvider',
  DiskStorageProvider,
);
