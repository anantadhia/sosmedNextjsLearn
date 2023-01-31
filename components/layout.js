import Nav from "./Nav";

function Layout({ children }) {
  return (
    <div className="mx-2 md:mx-10 ">
      <Nav />
      <div className=" md:max-w-5xl md:mx-auto">
        <main>{children}</main>
      </div>
    </div>
  );
}

export default Layout;
