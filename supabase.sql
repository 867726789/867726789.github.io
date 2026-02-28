-- 创建文章表
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  category_id TEXT NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建友链表
CREATE TABLE friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建存储桶用于存放图片
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- 创建存储桶策略
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'images' AND auth.role() = 'authenticated'
);
CREATE POLICY "Authenticated users can update images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'images' AND auth.role() = 'authenticated'
);
CREATE POLICY "Authenticated users can delete images" ON storage.objects FOR DELETE USING (
  bucket_id = 'images' AND auth.role() = 'authenticated'
);

-- 创建文章表策略
CREATE POLICY "Public Access" ON articles FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert articles" ON articles FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);
CREATE POLICY "Authenticated users can update articles" ON articles FOR UPDATE USING (
  auth.role() = 'authenticated'
);
CREATE POLICY "Authenticated users can delete articles" ON articles FOR DELETE USING (
  auth.role() = 'authenticated'
);

-- 创建友链表策略
CREATE POLICY "Public Access" ON friends FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert friends" ON friends FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);
CREATE POLICY "Authenticated users can update friends" ON friends FOR UPDATE USING (
  auth.role() = 'authenticated'
);
CREATE POLICY "Authenticated users can delete friends" ON friends FOR DELETE USING (
  auth.role() = 'authenticated'
);
