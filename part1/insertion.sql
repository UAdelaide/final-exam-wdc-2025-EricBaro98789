
INSERT INTO Users (username, email, password_hash, role) VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner');

INSERT INTO Users (username, email, password_hash, role) VALUES
('davewalker', 'dave@example.com', 'hashedabc', 'walker'),
('emilyowner', 'emily@example.com', 'hasheddef', 'owner');

INSERT INTO Dogs (owner_id, name, size) VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small');

INSERT INTO Dogs (owner_id, name, size) VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Rocky', 'large'),
((SELECT user_id FROM Users WHERE username = 'emilyowner'), 'Lucy', 'small'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Buddy', 'medium');

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
((SELECT dog_id FROM Dogs WHERE name = 'Max' LIMIT 1), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Bella' LIMIT 1), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted');


INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
((SELECT dog_id FROM Dogs WHERE name = 'Rocky' LIMIT 1), '2025-06-11 10:00:00', 60, 'City Center', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Lucy' LIMIT 1), '2025-06-12 14:00:00', 20, 'Suburbia Gardens', 'completed'),
((SELECT dog_id FROM Dogs WHERE name = 'Buddy' LIMIT 1), '2025-06-12 16:00:00', 45, 'River Trail', 'cancelled');
