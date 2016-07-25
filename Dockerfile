FROM ...

COPY package.json /src/package.json
RUN cd /src && npm install

COPY    . /src
COPY    ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN cd /src && typings install lodash
RUN cd /src && typings install d3

EXPOSE  3000 3003 80 443 22

# # Set the default command to run when starting the container
CMD     ["/usr/bin/supervisord"]