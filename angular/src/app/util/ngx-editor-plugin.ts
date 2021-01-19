import { Plugin } from 'prosemirror-state';
import { image } from 'ngx-editor/plugins';

const plugins: Plugin[] = [
  image({
    // enables image resizing
    resize: true,
  }),
];

export default plugins;
