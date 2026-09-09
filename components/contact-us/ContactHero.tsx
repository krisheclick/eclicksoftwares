import { Container } from "react-bootstrap";
import Styles from "./ContactHero.module.css";

type ContactHeroProps = {
    title?: string;
    description?: string;
    image?: string;
};

export default function ContactHero({ title, description, image }: ContactHeroProps) {
    const cleanTitle = (title || "Contact <span>Us</span>")
        .replace(/Ã‚+/g, "")
        .replace(/\s+/g, " ")
        .trim();
    const imageUrl = image
        ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${image}`
        : "";
    const cleanDescription = description
        ?.replace(/\s+/g, " ")
        .trim();

    return (
        <div
            className={Styles.cmsBanner}
            style={imageUrl ? { background: `url("${imageUrl}") no-repeat center center/cover` } : undefined}
        >
            <Container>
                <div className={Styles.bannerText}>
                    <h1
                        className={`heading ${Styles.title}`}
                        dangerouslySetInnerHTML={{ __html: cleanTitle }}
                    />
                    {cleanDescription && (
                        <p
                            className={Styles.description}
                            dangerouslySetInnerHTML={{ __html: cleanDescription }}
                        />
                    )}
                </div>
            </Container>
        </div>
    );
}
