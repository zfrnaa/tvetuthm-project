import {
  Typography,
} from "@material-tailwind/react";

const YEAR = new Date().getFullYear();

export function FooterWithSocialLinks() {

  const LINKS =
  {
    items: [
      {
        id: "uthm",
        title: "UTHM",
        href: "https://www.uthm.edu.my/",
      },
      {
        id: "academic",
        title: "Akademik",
        href: "https://amo.uthm.edu.my/",
      },
      {
        id: "staff",
        title: "Staf",
        href: "https://community.uthm.edu.my",
      },
    ],
  };

  return (
    <footer className="bg-background z-20">
      <div className="w-full mx-auto px-4 pt-4">
        {/* <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2"> */}
        <div className="w-full flex flex-col items-center justify-between md:flex-row">
          {/* <img src={uthmLogo} alt="UTHM Logo" className="h-8 w-auto" /> */}

          {/* <div className="grid grid-cols-3 justify-between gap-x-6 gap-y-4"> */}
          <Typography className="font-sans antialiased font-bold text-base md:text-lg lg:text-xl text-inherit" >
            Sistem Penilaian TVET UTHM
          </Typography>
          <div className="flex gap-x-6 gap-y-4">

            {LINKS.items.map((item) => (
              <span key={item.id}>
                <Typography
                  as="a"
                  href={item.href}
                  className="py-1  dark:!text-darkText">
                  {item.title}
                </Typography>
              </span>
            ))
            }
          </div>
        </div>
        <div className="mt-4 flex w-full flex-col items-center justify-center gap-4 border-t border-surface py-4 md:flex-row md:justify-between">
          <Typography type="small" className="text-center text-xs">
            &copy; {YEAR}{" "}
            <a href="#">Sistem Penilaian TVET</a> Hak Cipta Terpelihara.
          </Typography>
          <Typography type="small" className="text-center text-xs" >
            Dibangunkan oleh{" "}
            <a
              href="#
              https://www.github.com/zfrnaa/"
              target=""
              rel="noopener noreferrer"
              className="hover:!text-primaryCustom dark:!text-darkText"
            >
              RN
            </a>
          </Typography>
        </div>
      </div>
    </footer>
  );
}