/* istanbul ignore file */

import { createContainer } from 'instances-container';

import { serviceContainer } from './service.container.js';
import { useCaseContainer } from './use-case.container.js';

// creating container
export const container = createContainer().register([...serviceContainer, ...useCaseContainer]);
