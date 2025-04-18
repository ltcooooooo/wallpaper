export default ({ type, message }) => {
    ElMessage({
        message,
        type: 'success',
        plain: true,
        offset: 46
    })
}