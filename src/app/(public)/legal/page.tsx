import Link from "next/link";
import { legalBlocks } from "@/lib/legal/legalContent";
import LegalHashScroller from "./LegalHashScroller";
import styles from "./legal.module.css";

export const metadata = {
  title: "Termos e Privacidade | PsicoConnect",
  description:
    "Termos de uso, política de privacidade, uso de inteligência artificial e consentimento de dados sensíveis do PsicoConnect.",
};

export default function LegalPage() {
  return (
    <main className={styles.legalPage}>
      <LegalHashScroller />

      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          <Link href="/" className={styles.backLink}>
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            Voltar para o início
          </Link>

          <div className={styles.heroCard}>
            <span className={styles.badge}>Documentos legais</span>

            <h1>Termos, Privacidade e Consentimentos</h1>

            <p>
              Consulte as regras de uso do PsicoConnect, a política de
              privacidade, os limites do uso da inteligência artificial e o
              consentimento para tratamento de dados sensíveis.
            </p>

            <span className={styles.updated}>
              Última atualização: Junho de 2026
            </span>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.contentInner}>
          <aside className={styles.navigationCard}>
            <h2>Nesta página</h2>

            <nav
              className={styles.navigationList}
              aria-label="Documentos legais"
            >
              {legalBlocks.map((block) => (
                <a key={block.id} href={`#${block.id}`}>
                  {block.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className={styles.documentsList}>
            {legalBlocks.map((block, index) => (
              <section
                key={block.id}
                id={block.id}
                className={styles.documentCard}
              >
                <header className={styles.documentHeader}>
                  <span className={styles.documentNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className={styles.documentTitleGroup}>
                    <h2>{block.title}</h2>
                    <p>{block.summary}</p>
                  </div>
                </header>

                <div className={styles.documentSections}>
                  {block.content.map((section) => (
                    <article key={section.heading} className={styles.textBlock}>
                      <h3>{section.heading}</h3>

                      {section.paragraphs?.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}

                      {section.items && (
                        <ul>
                          {section.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}