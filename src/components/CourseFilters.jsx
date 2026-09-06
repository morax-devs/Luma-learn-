export function CourseFilters({ search, onSearchChange, category, onCategoryChange, level, onLevelChange, categories, levels }) {
  return (
    <div className="course-filters">
      <label className="course-search">
        <span aria-hidden="true">⌕</span>
        <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search by course title" aria-label="Search by course title" />
      </label>
      <label className="select-field"><span>Category</span><select value={category} onChange={(event) => onCategoryChange(event.target.value)} aria-label="Filter by category">{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label className="select-field"><span>Level</span><select value={level} onChange={(event) => onLevelChange(event.target.value)} aria-label="Filter by level">{levels.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
    </div>
  )
}
