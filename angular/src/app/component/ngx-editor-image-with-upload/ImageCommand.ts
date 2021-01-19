import { EditorState, NodeSelection, Transaction } from 'prosemirror-state';
import { Command } from 'prosemirror-commands';

/**
 * https://github.com/sibiraj-s/ngx-editor/blob/master/src/lib/commands/types.ts
 */

export type Dispatch = (tr: Transaction) => void | null;

/**
 * https://github.com/sibiraj-s/ngx-editor/blob/master/src/lib/commands/Image.ts
 */

export interface ImageAttrs {
  alt?: string;
  title?: string;
  width?: string;
}

class ImageCommand {
  static insert(src: string, attrs: ImageAttrs): Command {
    return (state: EditorState, dispatch: Dispatch): boolean => {
      const { schema, tr, selection } = state;

      const type = schema.nodes.image;
      if (!type) {
        return false;
      }

      const imageAttrs = {
        width: null,
        src,
        ...attrs
      };

      if (!imageAttrs.width && selection instanceof NodeSelection && selection.node.type === type) {
        imageAttrs.width = selection.node.attrs.width;
      }

      tr.replaceSelectionWith(type.createAndFill(imageAttrs));

      const resolvedPos = tr.doc.resolve(
        tr.selection.anchor - tr.selection.$anchor.nodeBefore.nodeSize
      );

      tr
        .setSelection(new NodeSelection(resolvedPos))
        .scrollIntoView();

      if (tr.docChanged) {
        dispatch?.(tr);
        return true;
      }

      return false;
    };
  }

  static isActive(state: EditorState): boolean {
    const { selection } = state;
    if (selection instanceof NodeSelection) {
      return selection.node.type.name === 'image';
    }

    return false;
  }
}

export default ImageCommand;
