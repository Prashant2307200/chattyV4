import Preview from "../components/Settings/Preview";
import ThemePallet from "../components/Settings/ThemePallet"

import { List } from "../components/ui/List";
import { THEMES } from "../constants/theme.constant"; 

const SettingsPage = () => {  

  return (
    <div className="overflow-auto">
      <main className="h-[100svh] container mx-auto px-4 pt-20 max-w-5xl space-y-6">

        <section className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
        </section>

        <section className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
          <List data={THEMES} getItem={t => <ThemePallet t={t} />} />
        </section>

        {/* Prview Page */}
        <Preview />

      </main>
    </div>
  );
};

export default SettingsPage;