export function AnswerOption({ option, index, selected, onSelect, disabled }) {
  const optionLabel = String.fromCharCode(65 + index)
  return <button className={`answer-option ${selected ? 'selected' : ''}`} onClick={() => onSelect(option)} disabled={disabled} aria-pressed={selected}><span className="answer-letter">{optionLabel}</span><span>{option}</span>{selected && <span className="answer-selected">✓</span>}</button>
}
