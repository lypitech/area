FROM ghcr.io/cirruslabs/flutter:stable

WORKDIR /app

RUN git config --global --add safe.directory /sdks/flutter

COPY pubspec.* ./
COPY .env ./
COPY assets/ assets/
RUN flutter pub get
RUN flutter config --enable-android

COPY . .

RUN flutter build apk --release

CMD ["cp", "build/app/outputs/flutter-apk/app-release.apk", "/output/client.apk"]
