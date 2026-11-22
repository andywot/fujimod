import type { JSX } from '@solidjs/web';
import { CommandFace, KeyFace, PadFace } from '@fujimod/emulator-ui/ui/control-faces';

declare const __FUJIMOD_FILM_EDITOR_DEMO__: boolean;

/** Each camera key and the key the Film Editor's page reads for it. */
const keys = new Map([
  ['up', { key: 'ArrowUp', label: 'Up' }],
  ['down', { key: 'ArrowDown', label: 'Down' }],
  ['left', { key: 'ArrowLeft', label: 'Left' }],
  ['right', { key: 'ArrowRight', label: 'Right' }],
  ['press', { key: 'Enter', label: 'MENU/OK' }],
  ['back', { key: 'Escape', label: 'DISP/BACK' }],
  ['decrease', { key: '[', label: 'Rear dial left' }],
  ['increase', { key: ']', label: 'Rear dial right' }],
]);

/** The Film Editor running live at the top of the home page, with the camera's rear keys. */
export function FilmEditorHero() {
  let frame: HTMLIFrameElement | undefined;
  const send = (action: string) => {
    const key = keys.get(action)?.key;
    if (key)
      frame?.contentWindow?.postMessage({ type: 'focal-preview-key', key }, window.location.origin);
  };
  const button = (action: string, className: string, content: JSX.Element) => (
    <button
      type="button"
      class={className}
      aria-label={keys.get(action)?.label}
      onClick={() => send(action)}
    >
      {content}
    </button>
  );
  return (
    <>
      {__FUJIMOD_FILM_EDITOR_DEMO__ && (
        <section class="film-editor-hero" aria-labelledby="film-editor-hero-title">
          <h2 class="film-editor-hero-title" id="film-editor-hero-title">
            Film Editor
          </h2>
          <div class="film-editor-hero-screen">
            <iframe
              ref={(element) => {
                frame = element;
              }}
              src="/demo/film-editor/index.html"
              title="Film Editor"
              width={720}
              height={480}
            />
          </div>
          <div class="film-editor-hero-keys" role="group" aria-label="Camera controls">
            <CommandFace
              size="panel"
              part={{ kind: 'command', marking: {} }}
              renderKey={(action, className, content) =>
                action === 'press' ? <span class={className} /> : button(action, className, content)
              }
            />
            <PadFace
              size="panel"
              part={{ kind: 'pad', marking: { face: ['MENU', 'OK'] } }}
              renderKey={button}
            />
            <KeyFace
              size="panel"
              part={{ kind: 'key', marking: { face: ['DISP', 'BACK'] } }}
              renderKey={(_action, className, content) => button('back', className, content)}
            />
          </div>
        </section>
      )}
    </>
  );
}
