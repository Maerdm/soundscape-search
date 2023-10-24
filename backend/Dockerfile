FROM python:3.9

COPY ./requirements.txt /app/

WORKDIR /app

RUN pip3 install -r requirements.txt

COPY ./src /app/src

EXPOSE 8000

CMD ["uvicorn", "src.backend_v1:app", "--host", "0.0.0.0"]
