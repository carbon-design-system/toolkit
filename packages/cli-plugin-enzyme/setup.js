'use strict';

const enzyme = require.requireActual('enzyme');
const Adapter = require.requireActual('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });
