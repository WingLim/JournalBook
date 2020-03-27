import { h } from 'preact';

const QuestionTextarea = ({ onChange, id, value, label }) => (
  <div key={id} class="question">
    <label for={id} dir="auto">
      {label}
    </label>
    <textarea
      id={id}
      dir="auto"
      value={value}
      placeholder="Start writing..."
      onChange={event => {
        event.target.style.height = 'auto';
        event.target.getBoundingClientRect();
        event.target.style.height = event.target.scrollHeight + 'px';
        onChange(event.target.value);
      }}
    />
  </div>
);

export { QuestionTextarea };
