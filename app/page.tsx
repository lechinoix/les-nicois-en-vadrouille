import Link from 'next/link';
import { publishedArticles } from '@/lib/public';
import sports from '@/lib/sports.json';
import Photo from '@/components/Photo';
import ArticleList from '@/components/ArticleList';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const articles = await publishedArticles();
  return (
    <>
      <div className="hero home">
        <Photo
          url="https://res.cloudinary.com/dowsxscl0/image/upload/v1640295015/monaco_2bdf322c6b.jpg"
          alt="Montagnes au-dessus de Monaco"
          eager
        />
        <h1>Bienvenue sur notre blog d’aventures Outdoor</h1>
      </div>
      <main>
        <section className="intro">
          <div>
            <h2>HELLO</h2>
            <p>
              Bienvenue sur notre blog qui recense toutes nos sorties Outdoor :
              ski, escalade, rando, alpi, cascade de glace ou encore spéléo.
              Nous sommes installés actuellement sur Grenoble donc beaucoup de
              nos aventures sont dans cette magnifique région : Belledonne, les
              Écrins, le Vercors…
            </p>
            <p>
              Notre objectif : raconter nos aventures pour se souvenir dans 50
              ans, mais aussi donner envie de s’installer dans cette belle
              région et de se lancer dans l’aventure outdoor quelle qu’elle
              soit… et bientôt vous aider à planifier ou trouver la course qui
              correspond le mieux à vos envies du moment !
            </p>
            <p>
              À bientôt dans les montagnes
              <br />
              Ambre & Nico
            </p>
          </div>
          <Photo
            url="https://res.cloudinary.com/dowsxscl0/image/upload/v1638305939/medium_IMG_0063_2_0c22cc2fb2.jpg"
            alt="Nous deux en haut du mont Coolidge"
          />
        </section>
        <h2 className="section-title">Nos dernières sorties</h2>
        <ArticleList articles={articles} limit={3} />
        <Link className="more" href="/adventures">
          En voir plus
        </Link>
        <h2 className="section-title">Nos sports</h2>
        <div className="grid">
          {sports.map((s) => (
            <Link className="card" href={`/sport/${s.slug}`} key={s.slug}>
              <Photo url={s.cover.url} position={s.cover.position} alt="" />
              <h2>{s.name}</h2>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
