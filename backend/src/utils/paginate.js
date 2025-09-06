export const paginate = (array, page = 1, pageSize = 10) => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    data: array.slice(start, end),
    page: Number(page),
    pageSize: Number(pageSize),
    total: array.length,
    totalPages: Math.ceil(array.length / pageSize)
  }
}
