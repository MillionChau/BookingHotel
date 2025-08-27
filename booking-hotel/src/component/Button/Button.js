import styles from "./Button.module.scss";

function Button({ content }) {
  const { container, box1 } = styles;
  return (
    <>
      <div className={container}>
        <div className={box1}>content</div>
      </div>
      <button type="button" class="btn btn-primary">
        {content}
      </button>
    </>
  );
}
export { Button };
