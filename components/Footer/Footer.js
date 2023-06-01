import gs_logo from "../../images/gs_logo.png";
import github from "../../images/github.png";
import linkedin from "../../images/linkedin.png";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="sticky top-[100vh]  bg-[#252c38] text-white">
      <div className="container relative mx-auto px-5 pb-10 pt-0">
        {/*  Flex container for all items  */}
        <div className="flex flex-col items-center justify-between space-y-12 md:flex-row md:space-y-0">
          <div className="mt-14">
            <div className="flex space-x-3">
              <div>&copy; 2023 Giorgio Savron</div>
            </div>
          </div>
          {/*  Social  */}
          <div className="!mt-10 flex items-center space-x-8 pb-0">
            <div>
              <a
                href="https://www.giorgiosavron.com"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src={gs_logo}
                  alt="GS_logo"
                  className="h-[30px] w-[30px]"
                />
              </a>
            </div>
            <div>
              <a
                href="https://www.linkedin.com/in/giorgio-savron/"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src={linkedin}
                  alt="Linkedin"
                  className="h-[30px] w-[30px]"
                />
              </a>
            </div>
            <div>
              <a
                href="https://github.com/gsavr/movie_search"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src={github}
                  alt="github"
                  className="h-[30px] w-[30px]"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
