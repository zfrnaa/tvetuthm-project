import {
  Typography,
  // IconButton
} from "@material-tailwind/react";
// import { Github } from "iconoir-react";
// import uthmLogo from "@/assets/images/uthm_logo.png";
import { useTranslation } from "react-i18next";

const YEAR = new Date().getFullYear();

export function FooterWithSocialLinks() {

  const { t } = useTranslation();

  const LINKS =
  {
    items: [
      {
        id: "uthm",
        title: "UTHM Website",
        href: "https://www.uthm.edu.my/",
      },
      {
        id: "academic",
        title: "UTHM Academic",
        href: "https://amo.uthm.edu.my/",
      },
      {
        id: "fptv",
        title: "FPTV Website",
        href: "https://fptv.uthm.edu.my/",
      },
      {
        id: "staff",
        title: "Staff",
        href: "https://telefon.uthm.edu.my/fakulti/senarai2/18",
      },
    ],
  };

  return (
    // <footer className="relative mt-14 mx-4">
    <footer className={`bg-background z-20 transition-all duration-300`}>
      <div className="w-full mx-auto px-4 pt-4">
        {/* <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2"> */}
        <div className="w-full flex flex-col items-center justify-between md:flex-row">
          {/* <img src={uthmLogo} alt="UTHM Logo" className="h-8 w-auto" /> */}

          {/* <div className="grid grid-cols-3 justify-between gap-x-6 gap-y-4"> */}
          <Typography type="h6">
            {t("TVET UTHM Assessment System")}
          </Typography>
          <div className="flex gap-x-6 gap-y-4">

            {LINKS.items.map((item) => (
              <span key={item.id}>
                <Typography
                  as="a"
                  href={item.href}
                  className="py-1 hover:!text-primaryCustom dark:!text-darkText"
                >
                  {item.title}
                </Typography>
              </span>
            ))
            }
          </div>
        </div>
        <div className="mt-4 flex w-full flex-col items-center justify-center gap-4 border-t border-surface py-4 md:flex-row md:justify-between">
          <Typography type="small" className="text-center">
            &copy; {YEAR}{" "}
            <a href="#">{t("TVET Assessment System")}</a>. {t("All Rights Reserved")}
          </Typography>
          <Typography type="small" className="text-center">
            {t("Developed by")}{" "}
            <a
              href="
              https://www.github.com/zfrnaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:!text-primaryCustom dark:!text-darkText"
            >
              RN
            </a>
          </Typography>
          {/* <div className="flex gap-1 sm:justify-center">
            <IconButton
              as="a"
              href="https://www.github.com/zfrnaa"
              color="secondary"
              variant="ghost"
              size="sm"
              target="_blank"
              aria-label="Developer's Github"
            >
              <Github className="h-4 w-4" />
            </IconButton>
          </div> */}
        </div>
      </div>
    </footer>
  );
}