/* istanbul ignore file */

import { createContainer } from 'instances-container';

import { serviceContainer } from './service.container.js';
import { useCaseContainer } from './use-case.container.js';

// creating container
const container = createContainer();

container.register([...serviceContainer, ...useCaseContainer]);

export { container };
