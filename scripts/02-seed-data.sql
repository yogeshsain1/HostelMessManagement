-- Seed data for Hostel & Mess Management App

-- Insert sample hostels
INSERT INTO hostels (id, name, total_rooms) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Sunrise Hostel', 100),
  ('550e8400-e29b-41d4-a716-446655440002', 'Moonlight Hostel', 80),
  ('550e8400-e29b-41d4-a716-446655440003', 'Green Valley Hostel', 120),
  (1, 'Aryabhatta Hall', 101, 120),
  (2, 'Raman House', 102, 95),
  (3, 'Bose Residency', 103, 110),
  (4, 'Kalpana Chawla', 104, 80),
  (5, 'Abdul Kalam Hall', 105, 150),
  (6, 'Ramanujan Block', 106, 100),
  (7, 'Tagore Hostel', 107, 130),
  (8, 'Nehru House', 108, 90),
  (9, 'Radhakrishnan', 109, 85),
  (10, 'Vivekananda Hall', 110, 140);

-- Insert sample users (password is 'password123' hashed)
INSERT INTO users (id, email, password_hash, full_name, phone, role, hostel_id, room_number) VALUES
  ('550e8400-e29b-41d4-a716-446655440010', 'admin@hostel.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Admin User', '+1234567890', 'admin', NULL, NULL),
  ('550e8400-e29b-41d4-a716-446655440011', 'warden1@hostel.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'John Warden', '+1234567891', 'warden', '550e8400-e29b-41d4-a716-446655440001', NULL),
  ('550e8400-e29b-41d4-a716-446655440012', 'student1@hostel.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Alice Student', '+1234567892', 'student', '550e8400-e29b-41d4-a716-446655440001', 'A101'),
  ('550e8400-e29b-41d4-a716-446655440013', 'student2@hostel.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Bob Student', '+1234567893', 'student', '550e8400-e29b-41d4-a716-446655440001', 'A102'),
  (1, 'admin@college.com', '$2b$12$adminhash', 'System Admin', '9999000001', 'admin', NULL, NULL),
  (2, 'warden1@college.com', '$2b$12$warden1hash', 'Prof. Sharma', '9999000002', 'warden', 1, NULL),
  (3, 'warden2@college.com', '$2b$12$warden2hash', 'Dr. Meena', '9999000003', 'warden', 2, NULL),
  (4, 'warden3@college.com', '$2b$12$warden3hash', 'Prof. Iyer', '9999000004', 'warden', 3, NULL),
  (5, 'student1@college.com', '$2b$12$student1hash', 'Ankit Verma', '9999000005', 'student', 1, 101),
  (6, 'student2@college.com', '$2b$12$student2hash', 'Priya Singh', '9999000006', 'student', 1, 102),
  (7, 'student3@college.com', '$2b$12$student3hash', 'Rohan Gupta', '9999000007', 'student', 2, 201),
  (8, 'student4@college.com', '$2b$12$student4hash', 'Neha Sharma', '9999000008', 'student', 2, 202),
  (9, 'student5@college.com', '$2b$12$student5hash', 'Karan Patel', '9999000009', 'student', 3, 301),
  (10, 'student6@college.com', '$2b$12$student6hash', 'Sneha Agarwal', '9999000010', 'student', 3, 302);

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

-- Seed data for leave_requests table
INSERT INTO leave_requests (id, user_id, start_date, end_date, reason, status, created_at) VALUES
  (1, 5, '2025-08-01', '2025-08-03', 'Family function', 'approved', '2025-07-25 09:10:00'),
  (2, 6, '2025-08-05', '2025-08-07', 'Medical check-up', 'pending', '2025-07-28 14:30:00'),
  (3, 7, '2025-08-10', '2025-08-15', 'Going home for festival', 'rejected', '2025-07-29 11:00:00'),
  (4, 8, '2025-08-02', '2025-08-04', 'Attending cousin’s wedding', 'approved', '2025-07-27 16:20:00'),
  (5, 9, '2025-08-12', '2025-08-13', 'Internship interview', 'pending', '2025-07-30 08:45:00'),
  (6, 10, '2025-08-18', '2025-08-19', 'Emergency travel', 'pending', '2025-08-01 10:15:00'),
  (7, 5, '2025-09-01', '2025-09-05', 'Family health issues', 'pending', '2025-08-10 12:30:00'),
  (8, 6, '2025-08-20', '2025-08-22', 'Friend’s marriage', 'approved', '2025-08-05 17:10:00'),
  (9, 7, '2025-08-25', '2025-08-28', 'Going for sports tournament', 'approved', '2025-08-08 15:00:00'),
  (10, 8, '2025-08-29', '2025-08-30', 'Personal reasons', 'rejected', '2025-08-09 18:40:00');
