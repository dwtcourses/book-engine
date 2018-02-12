import csv
import math

OLD_FILE_NAME = 'BX-Book-Ratings.csv'
NEW_FILE_NAME = 'demo.csv'


def clean_data(old_file_name, new_file_name):
    f = open(old_file_name)
    csv_f = csv.reader(f)
    data = []
    frequncy = 0
    while frequncy < 5000:
        try:
            for row in csv_f:
                row_data = str(row[0]).split(";")
                first_column = "'{}'".format(row_data[0])
                second_column = "'{}'".format(row_data[1][1:-1])
                rating = row_data[2][1:-1]
                ratings = math.floor(int(rating) / 2)
                data.append([first_column, second_column, ratings])
                frequncy += 1
        except UnicodeDecodeError:
            continue

    myFile = open(new_file_name, 'w')
    with myFile:
        writer = csv.writer(myFile, delimiter=";")
        writer.writerows(data)


if __name__ == "__main__":
    clean_data(OLD_FILE_NAME, NEW_FILE_NAME)

