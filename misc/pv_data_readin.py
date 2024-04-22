import struct

# Label
label = '20240416195527'
# Path to your binary file
file_path = 'C:/Users/Beno/Documents/SZAKI/dev/aram/input/pv/his_inv/his_inv_rd_'+label
# Output file path
output_path = 'C:/Users/Beno/Documents/SZAKI/dev/aram/input/pv/his_inv/his_inv_extraction_'+label+'.csv'

# Open the binary file
with open(file_path, 'rb') as file:
    # Read the entire file - be cautious with very large files, consider processing in chunks
    data = file.read()

# Assuming each data point is a 4-byte integer
data_format = 'I'  # Change this format as per your data's structure
data_size = struct.calcsize(data_format)
data_points = []

# Iterate over the data and unpack each data point
for i in range(0, len(data), data_size):
    data_point, = struct.unpack(data_format, data[i:i+data_size])
    data_points.append(data_point)

# Save the extracted numbers to a text file
with open(output_path, 'w') as output_file:
    for point in data_points:
        output_file.write(f'{point}\n')

print(f'Data extracted and saved to {output_path}')