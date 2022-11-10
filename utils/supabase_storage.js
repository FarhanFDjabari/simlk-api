const { createClient } = require('@supabase/supabase-js')

const supabase = createClient('https://sjdijscmtkwnljhhfeuu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZGlqc2NtdGt3bmxqaGhmZXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjU5ODc0MTAsImV4cCI6MTk4MTU2MzQxMH0.8vqzPwtEvU4KNdeI5RqCUBPzsSOjq5bp4xWRvFf3BVg')


const uploadToSupabase = (avatar) => {
    return supabase.storage.from('simplk-images').upload(`public/${avatar.name}`, avatar.data, {
        cacheControl: '4800',
        upsert: false,
        contentType: avatar.mimetype,
    }).then(function (_data) {
        return true
    }).catch(function (_err) {
        return false
    })
}
module.exports = {
    uploadToSupabase
}

