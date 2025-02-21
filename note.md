AWS

- Create account and sign in
- create new instance in EC2
- donnot forget to create a key pair
- create a security group
- donnot forget choose the free trail
- make the elastic
  . create elastic ip then enter in it and make it static with your instance public ip
- Enter the security group to ensure from inbound rules

1. connect with ssh
   ssh -i "my-key.pem" ec2-user@public-ip

2. make update to upuntu

sudo apt update

3. install nodejs PPA (Personal package archive)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   then
   sudo apt install nodejs

4. install pm2 because of when i close terminal app still run on background
   sudo npm install -g pm2

5. use fileZilla to upload and download files

6. install nginx
   sudo apt install nginx

7. edit on nginx
   sudo nano /etc/nginx/sites-available/default

proxy_pass http://localhost:3000;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;

8. restart nginx
   sudo systemctl restart nginx

9. start pm2
   pm2 start index.js -i 0
   to delete pm2 instance
   pm2 delete index.js

   to get logs in pm2
   pm2 logs

pm2 restart all
