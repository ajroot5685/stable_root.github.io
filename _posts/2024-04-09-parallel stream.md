---
title: 병렬 스트림(ParallelStream) 간단하게 알아보기
date: 2024-04-08 17:44:00 +09:00
categories: [java]
tags:
  [
    java,
    stream
  ]
---

## 🤔 병렬 스트림(ParallelStream)
- 자바 8에서 등장한 stream의 기능으로 병렬 처리를 쉽게 처리할 수 있는 메서드이다.
- 개발자가 직접 쓰레드 혹은 쓰레드풀을 생성/관리 할 필요 없이 `parallelStream()`, `parallel()` 만 사용하면 병렬 처리가 된다.
- `Fork / Join Framework` 관리 방식을 이용한다.

## 😮 Fork / Join Framework
- 자바 7에 도입되어 병렬 실행을 용이하게 하는 도구이다.
- 데이터를 작은 부분으로 나누고, 각 부분을 병렬로 처리한 다음, 결과를 결합하는 방식이다.
    > 분할 기법과 유사하다.
- `Work-Stealing 메커니즘`을 사용한다.

#### 주요 구성 요소
- ForkJoinPool
    - task의 실행을 관리하는 병렬 처리용 쓰레드 풀이다.
    - 사용자가 실행하고자 하는 task들을 보관한다.
- Worker Thread
    - 실제 작업을 수행하는 쓰레드이다.
    - ForkJoinPool로부터 task를 가져와(take) 처리한다.
    - 각 worker thread 들은 자신만의 work deque 를 가지고 있다.

#### Work-Stealing 메커니즘

![work-stealing](/assets/img/240409/work-stealing.png)

1. 사용자가 task를 등록한다.(submit)
2. inbound queue에 task가 들어가고, worker thread A와 B가 task를 가져가 처리한다.(take)
3. A와 B는 자신만의 work deque 를 가지고 있으며, 자신의 task가 없다면 다른 worker thread의 task를 가져와 처리한다.
    > 이 work-strealing 메커니즘으로 CPU 자원이 놀지 않고 최적의 성능을 낼 수 있게 된다.

#### 상세하게 살펴보기
- worker thread는 기본적으로 한번에 하나의 task만 가져와서 처리한다.
- task를 처리하는 과정에서 **task 분할**이 일어날 수 있고 하나의 큰 task가 여러개의 작은 task로 쪼개져서 worker thread의 deque에 추가된다.
- 때문에 한번에 하나씩 처리하더라도 task 분할로 인해 자신의 deque에 여러 개의 task가 등록될 수 있고 다른 쓰레드가 가져갈 수 있는 task가 생기는 것이다.

## 주의사항



<br>

> 출처
> 
> [[Java] 병렬 스트림(ParallelStream) 사용 방법 및 주의사항](https://dev-coco.tistory.com/183)

<br>

## 누군가가 물어본다면
<div class="spotlight1">
스트림은 데이터의 추상화된 연속적인 흐름을 다루는 API 입니다.
<br><br>
데이터 컬렉션을 함수형 스타일로 연속적이고 선언적으로 처리할 수 있게 되어 코드의 가독성과 유지보수성이 증가합니다.
</div>