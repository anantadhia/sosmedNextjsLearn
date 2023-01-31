import Nav from "./Nav";

function Layout({ children }) {
  return (
    <div className="mx-10  ">
      <Nav />
      <div className="mx-6 md:max-w-5xl md:mx-auto">
        <main>{children}</main>
      </div>
    </div>
  );
}

export default Layout;
