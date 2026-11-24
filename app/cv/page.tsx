import { experiences, personalInfo as p, formations } from '@/lib/cv';
import Markdown from '@/components/Markdown';
export default function CV() {
  return (
    <main className="below-header cv">
      <aside>
        <h1>{p.name}</h1>
        <p>
          {p.email}
          <br />
          {p.phone}
          <br />
          {p.address}
        </p>
        <h2>Objective</h2>
        <p>{p.objective}</p>
        <h2>Skills</h2>
        <ul>
          {p.skills.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <h2>Languages</h2>
        <ul>
          {p.languages.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <h2>Formations</h2>
        {formations.map((f) => (
          <p key={f.place}>
            {f.place} ({f.duration})<br />
            {f.degree}
          </p>
        ))}
      </aside>
      <section>
        <h2>Experiences</h2>
        {experiences.map((e) => (
          <section key={e.role}>
            <h3>{e.role}</h3>
            <p>
              {e.company} · {e.duration}
            </p>
            <Markdown>{e.description}</Markdown>
          </section>
        ))}
      </section>
    </main>
  );
}
