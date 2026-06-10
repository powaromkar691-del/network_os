import { EXPECTED_LINKEDIN_FILES } from "../data/exportFiles";
import { getBaseName } from "../lib/zip";
import SectionTitle from "../components/SectionTitle";

export default function UploadView({ files, loadSampleData, handleZip }) {
  return (
    <section>
      <SectionTitle
        eyebrow="Start"
        title="Upload the LinkedIn ZIP export"
        subtitle="Upload the full ZIP downloaded from LinkedIn. NetworkOS extracts CSV files, parses major sections, and builds the dashboard automatically."
      />

      <div className="rounded-[2rem] border border-dashed border-violet-300/30 bg-white/[0.05] p-10 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-500/15 text-4xl text-violet-300">
          ⬆️
        </div>

        <h3 className="text-2xl font-bold text-white">
          Drop or upload LinkedIn ZIP
        </h3>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
          Parses connections, messages, profile, skills, education, positions,
          certifications, company follows, languages, volunteering and rich
          media.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={loadSampleData}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-slate-200"
          >
            Load Sample Demo
          </button>

          <label className="cursor-pointer rounded-2xl bg-violet-500 px-5 py-3 text-sm font-bold text-white hover:bg-violet-400">
            Upload ZIP
            <input
              type="file"
              accept=".zip"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  handleZip(file);
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {EXPECTED_LINKEDIN_FILES.map((name) => {
          const found = files.find((file) => {
            return getBaseName(file.name).toLowerCase() === name.toLowerCase();
          });

          return (
            <div
              key={name}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <p className="text-sm text-slate-200">
                {name}
              </p>

              <p
                className={
                  found
                    ? "text-xs text-emerald-300"
                    : "text-xs text-slate-500"
                }
              >
                {found ? "Found" : "Missing"}
              </p>

              {found ? (
                <p className="mt-1 truncate text-[10px] text-slate-500">
                  {found.name}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}