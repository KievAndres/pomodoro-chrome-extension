import RotatingSphere from "@shared/components/RotatingSphere/RotatingSphere";

export default function StartFocusingMessage() {
  return (
    <section className="start-focusing-container">
      <section className="item rotating-sphere">
        <RotatingSphere />
      </section>
      <section className="item text">
        <span>Click to start focusing!</span>
      </section>
    </section>
  );
}
