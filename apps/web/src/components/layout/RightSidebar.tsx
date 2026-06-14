import "./RightSidebar.css";

export default function RightSidebar() {
  return (
    <aside className="right-sidebar">
      <section className="widget">
        <h3>Trending</h3>

        <ul>
          <li>#react</li>
          <li>#typescript</li>
          <li>#opensource</li>
        </ul>
      </section>

      <section className="widget">
        <h3>Builders</h3>

        <ul>
          <li>adi</li>
          <li>messi</li>
          <li>ronaldo</li>
        </ul>
      </section>
    </aside>
  );
}
