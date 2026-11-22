import { CustomSettingsApp } from '../../docs/design/custom-settings-editor/app';
import { DesignFrame } from '../../design/looks';
import { SiteFrame } from '../../ui/SiteFrame';
import { FilmEditorDemo } from './FilmEditorDemo';
import '../../home/site.css';

export default function CustomSettingsEditorFeature() {
  return (
    <SiteFrame>
      <main class="feature-page">
        <h1 class="feature-page-title">Custom Settings Editor</h1>
        <FilmEditorDemo />
        <DesignFrame title="Prototype">
          <CustomSettingsApp />
        </DesignFrame>
      </main>
    </SiteFrame>
  );
}
