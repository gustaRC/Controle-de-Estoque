import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
    <div class="footer bg-indigo-800 mt-8 p-5" style="border-radius: 0.4rem;">
        <div class="flex justify-content-between text-gray-100 flex-wrap gap-4">
            <span>
                <span>Gustavo Rodrigues - Web Developer</span>
                <span> - v. 24.06.13.01</span>
            </span>
            <span>
                <span>Marcos Júnior © </span>
                <span> - Formação Angular - Udemy</span>
            </span>
        </div>
    </div>
    `,
})
export class AppFooterComponent implements OnInit{
  ngOnInit(): void {}
}
