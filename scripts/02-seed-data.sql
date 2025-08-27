-- Seed data for Hostel & Mess Management App

-- Insert sample hostels
INSERT INTO hostels (id, name, total_rooms) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Sunrise Hostel', 100),
  ('550e8400-e29b-41d4-a716-446655440002', 'Moonlight Hostel', 80),
  ('550e8400-e29b-41d4-a716-446655440003', 'Green Valley Hostel', 120);

-- Insert sample users (password is 'password123' hashed)
INSERT INTO users (id, email, password_hash, full_name, phone, role, hostel_id, room_number) VALUES
  ('550e8400-e29b-41d4-a716-446655440010', 'admin@hostel.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Admin User', '+1234567890', 'admin', NULL, NULL),
  ('550e8400-e29b-41d4-a716-446655440011', 'warden1@hostel.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'John Warden', '+1234567891', 'warden', '550e8400-e29b-41d4-a716-446655440001', NULL),
  ('550e8400-e29b-41d4-a716-446655440012', 'student1@hostel.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Alice Student', '+1234567892', 'student', '550e8400-e29b-41d4-a716-446655440001', 'A101'),
  ('550e8400-e29b-41d4-a716-446655440013', 'student2@hostel.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Bob Student', '+1234567893', 'student', '550e8400-e29b-41d4-a716-446655440001', 'A102');

-- Update hostel wardens
UPDATE hostels SET warden_id = '550e8400-e29b-41d4-a716-446655440011' 
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- Insert sample mess menu for current week
INSERT INTO mess_menu (date, meal_type, items) VALUES
  (CURRENT_DATE, 'breakfast', ARRAY['Idli', 'Sambar', 'Coconut Chutney', 'Tea/Coffee']),
  (CURRENT_DATE, 'lunch', ARRAY['Rice', 'Dal', 'Vegetable Curry', 'Pickle', 'Curd']),
  (CURRENT_DATE, 'dinner', ARRAY['Roti', 'Paneer Curry', 'Rice', 'Dal', 'Salad']);

-- Insert sample complaints
INSERT INTO complaints (user_id, hostel_id, title, description, category, status, priority) VALUES
  ('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 'Broken AC in Room A101', 'The air conditioner in my room is not working properly', 'maintenance', 'pending', 'high'),
  ('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', 'Bathroom Cleaning Issue', 'Common bathroom on 1st floor needs cleaning', 'cleanliness', 'in-progress', 'medium');
