FROM python:3.9
COPY ./requirements.txt /app/
WORKDIR /app
RUN pip3 install -r requirements.txt
COPY ./src /app/src
RUN mkdir -p /app/dataset
RUN mkdir -p /app/recordings
EXPOSE 8000

# Create a startup script with a small delay to ensure MongoDB is ready
RUN echo '#!/bin/bash\necho "Waiting for MongoDB to be ready..."\nsleep 10\npython -m dataset.scripts.data_loader\nuvicorn src.backend_v1:app --host 0.0.0.0' > /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
