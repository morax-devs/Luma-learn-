import { useMemo, useState } from 'react'
import { CourseCard } from '../components/CourseCard'
import { CourseFilters } from '../components/CourseFilters'
import { EmptyState, ErrorState, LoadingState, PageContainer } from '../components/ui'
import { useAsyncData } from '../hooks/useAsyncData'
import { courseService } from '../services/courseService'

export function CoursesPage() {
  const { data, loading, error, retry } = useAsyncData(() => Promise.all([courseService.getCourses(), courseService.getCategories(), courseService.getLevels()]), [])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All courses')
  const [level, setLevel] = useState('All levels')
  const [courseList = [], categoryList = ['All courses'], levelList = ['All levels']] = data || []
  const filteredCourses = useMemo(() => courseList.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All courses' || course.category === category
    const matchesLevel = level === 'All levels' || course.level === level
    return matchesSearch && matchesCategory && matchesLevel
  }), [courseList, search, category, level])

  if (loading) return <PageContainer><LoadingState /></PageContainer>
  if (error) return <PageContainer><ErrorState onRetry={retry} /></PageContainer>
  return <PageContainer className="catalogue-page"><div className="catalogue-header"><div><p className="eyebrow coral">THE CATALOGUE</p><h1>Find your next<br /><em>useful skill.</em></h1><p className="page-lede">Thoughtful courses for curious people who want to make a difference with what they learn.</p></div><div className="catalogue-stat"><strong>{courseList.length}</strong><span>courses to<br />explore</span></div></div><CourseFilters search={search} onSearchChange={setSearch} category={category} onCategoryChange={setCategory} level={level} onLevelChange={setLevel} categories={categoryList} levels={levelList} /><div className="catalogue-results"><p>{filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found</p><span>Sorted by <b>Recommended</b></span></div>{filteredCourses.length ? <div className="course-grid catalogue-grid">{filteredCourses.map((course) => <CourseCard course={course} key={course.id || course._id} />)}</div> : <EmptyState title="No courses match those filters" description="Try a broader search or reset one of the filters to keep exploring." />}</PageContainer>
}
